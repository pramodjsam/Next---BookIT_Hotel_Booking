module.exports = {
  reactStrictMode: true,
  env: {
    DB_URI:
      "",
    CLOUDINARY_CLOUD_NAME: "",
    CLOUD_API_KEY: "",
    CLOUD_API_SECRET: "",
    SMTP_HOST: "",
    SMTP_PORT: 0,
    SMTP_USER: "",
    SMTP_PASS: "",
    SMTP_FROM_NAME: "",
    SMTP_FROM_EMAIL: "",
    STRIPE_API_KEY:
      "",
    STRIPE_SECRET_KEY:
      "",
    STRIPE_WEBHOOK_SECRET: "",
    NEXTAUTH_URL: "",
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};
