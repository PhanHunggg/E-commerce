const app = require("./src/app");
const PORT = process.env.PORT || 3000;

const sever = app.listen(PORT, () => {
  console.log(`Wsv eCommerce start with ${PORT}`);
});

process.on("SIGINT", () => {
  sever.close(() => console.log("Exit Server Express"));
});
