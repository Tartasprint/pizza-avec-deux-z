import { readFileSync } from 'fs'
import { createServer } from 'https'
import session from 'express-session'
import MongoStore from 'connect-mongo'
export const app_port = 3000
export const database = 'pizza-test'
export const mongodb_server_host = "127.0.0.1"
export const mongodb_server_port = "27017"
export const server = createServer({
  key: readFileSync('../secrets/key.pem'),
  cert: readFileSync('../secrets/cert.pem')
})
export const sessions_secrets = JSON.parse(readFileSync('../secrets/sessions-secrets.json').toString())
export const sessions_database = database + '-session'
export const session_parser = session({
  name: "__Host-id",
  resave: false,
  saveUninitialized: false,
  secret: sessions_secrets,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    domain: "",
    path: '/',
  },
  store: new MongoStore({
    mongoUrl: `mongodb://${mongodb_server_host}:${mongodb_server_port}/${sessions_database}`
  })
})