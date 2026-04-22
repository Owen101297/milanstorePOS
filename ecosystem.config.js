module.exports = {
  apps: [{
    name: "milan-pos",
    script: "npm",
    args: "run start",
    env: {
      PORT: 3004,
      NODE_ENV: "production"
    },
    interpreter: "none"
  }]
}