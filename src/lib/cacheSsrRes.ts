export default ({ res, duration = 60 * 60 * 12 }) => {
  if (res) {
    res.setHeader('Cache-Control', `public,s-maxage=${duration}`);
  }
}