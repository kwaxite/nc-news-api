const app = require('./app')

// app.listen(9090, ()=>{
//     ("App listening on port: 9090")
// })

const app = require('./app.js');
const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));