const backURL = (process.env.NODE_ENV === 'production')
  ? 'http://api.snsbyjg.website'
  : 'http://localhost:3065';

export default backURL;
