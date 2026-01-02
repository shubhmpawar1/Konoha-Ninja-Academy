const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json()); // for parsing JSON request bodies
app.use(cors());
const studentRoutes = require('./src/route/studentRoutes');
const instructorRoutes = require('./src/route/instructorRoutes');
const PORT = process.env.PORT || 7777;
app.use('/api', studentRoutes);
app.use('/api', instructorRoutes);



app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
});
