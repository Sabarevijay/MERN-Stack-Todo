const express = require("express");
const app = express();
const cors=require("cors");
const pool=require("./db");

const authorize = (req, res, next) => {
    const token = req.header("Authorization").split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: "Authorization denied" });
    }

    try {
        const verified = jwt.verify(token, "your_jwt_secret");
        req.user = verified;
        req.user_id = verified.user_id;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

const authenticateToken = (req, res, next) => {
  // Get token from the Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, "your_jwt_secret"); // Replace 'your_jwt_secret' with your actual secret key
    req.user_id = decoded.user_id; // Attach user_id to the request object
    next(); // Call the next middleware/route handler
  } catch (err) {
    console.error("Token is not valid:", err.message);
    return res.status(403).json({ message: "Token is not valid" });
  }
};

//Registration
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


//middleware 
app.use(cors());
app.use(express.json()); 

app.get("/protected", authorize, (req, res) => {
    res.json({ message: "This is a protected route" });
});



//ROUTES

//create a todo 
app.post("/todos",authenticateToken,async(req,res)=>{
    try {
        const { description } = req.body;
        const { user_id } = req;
        const newTodo = await pool.query(
            "INSERT INTO todo(description,user_id) VALUES($1,$2) RETURNING *",
            [description,user_id]
        );
        res.json(newTodo.rows[0]);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
})

//get all todo 
app.get("/todos", authenticateToken,async(req,res)=>{
    try {
        const { user_id } = req;
        // const allTodos=await pool.query("SELECT * FROM todo WHERE user_id = $1",
        const allTodos=await pool.query("SELECT todo_id, description, is_completed FROM todo WHERE user_id = $1",
            [user_id]
        );
        res.json(allTodos.rows);
    } catch (err) {
       console.log(err.message);
       res.status(500).send("Server error");
    }
});

//get a todo 
app.get("/todos/:id",authenticateToken,async(req,res)=>{
    try {
        const { user_id } = req;
        const { description } = req.body;
        const { id } = req.params;
        
        const todo =await pool.query("SELECT * FROM todo WHERE todo_id=$1 AND user_id = $2",[id,description])

        res.json(todo.rows[0]);
        
    } catch (err) {
        console.log(err.message);
        
    }
})


//update a todo

app.put("/todos/:id",authenticateToken,async(req,res)=>{
    try {
        const { id }=req.params;
        const { is_completed } = req.body;
        const { user_id } = req; 

        const updateTodo=await pool.query("UPDATE todo SET is_completed = $1 WHERE todo_id = $2 AND user_id = $3 RETURNING *",
            [is_completed, id, user_id]
        );
        if (updateTodo.rowCount === 0) {
            return res.status(404).json({ message: "Todo not found or not authorized" });
        }

        res.json(updateTodo.rows[0])
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
})


//delete a todo 

app.delete("/todos/:id",authenticateToken,async(req,res)=>{
    try {
        const { id }=req.params;
        const { user_id } = req;
        const deleteTodo=await pool.query("DELETE FROM todo WHERE todo_id = $1 AND user_id = $2",
            [id,user_id]
        );
        res.json("Todo was deleted");
    } catch (err) {
        
        console.log(err.message);
        
    }
})

//Login
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the user already exists
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user into the database
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, hashedPassword]
        );

        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check the password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate a token
        const token = jwt.sign({ user_id: user.rows[0].user_id }, "your_jwt_secret", { expiresIn: "1h" });
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//Todo ORM
//     app.get("/todos", authenticateToken, async (req, res) => {
//   try {
//     const { user_id } = req;
//     const allTodos = await pool.query(
//       "SELECT * FROM todo WHERE user_id = $1",
//       [user_id]
//     );
//     res.json(allTodos.rows);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });
  


app.listen(5000,()=>{
    console.log("Sever has started on the port 5000");
    
})
