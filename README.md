## Support HTTPS for Node.js Server with Express

```cmd
openssl genrsa -out key.pem
```

```cmd
openssl req -new -key key.pem -out csr.pem
```

```cmd
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
```