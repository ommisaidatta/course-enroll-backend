module.exports = async (to, subject, text) => {
  console.log("📧 Email Sent");
  console.log("To:", to);
  console.log("Message:", text);
};
