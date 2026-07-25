// require("dotenv").config()

// const app = require("./app")
// const mongoose = require("mongoose")
// const cleanupInactiveUsers = require("./utils/cleanupInactiveUsers");

// mongoose.connect(process.env.MONGO_URI)
// .then(async()=>{

//  console.log("DB Connected")

//  await cleanupInactiveUsers();

//   setInterval(() => {
//     cleanupInactiveUsers();
//   }, 24 * 60 * 60 * 1000);

//  app.listen(5000,()=>{
//   console.log("Server running on port 5000")
//  })

// })

require("dotenv").config();

const mongoose = require("mongoose");

const app = require("./app");
const cleanupInactiveUsers = require("./utils/cleanupInactiveUsers");
const { verifyMailer } = require("./utils/mailer");
const { sendEvaluationReminders } = require("./utils/evaluationReminders");

const PORT = Number(process.env.PORT || 5000);
const REMINDER_INTERVAL =
  Math.max(Number(process.env.REMINDER_INTERVAL_HOURS || 6), 1) *
  60 *
  60 *
  1000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("DB Connected");

    await cleanupInactiveUsers();

    setInterval(
      () => {
        cleanupInactiveUsers();
      },
      24 * 60 * 60 * 1000,
    );

    setInterval(
      () => {
        sendEvaluationReminders().catch((error) =>
          console.error("Evaluation reminder job failed:", error.message),
        );
      },
      REMINDER_INTERVAL,
    );

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);

      verifyMailer()
        .then(() => console.log("Brevo SMTP connection is ready"))
        .catch((error) =>
          console.error("Brevo SMTP configuration error:", error.message),
        );
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
