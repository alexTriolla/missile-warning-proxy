import app from './app';

const PORT = process.env.PORT || 3010;

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
