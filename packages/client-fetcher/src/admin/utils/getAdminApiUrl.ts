const getAdminApiUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}`;
  }

  return process.env.SERVER_URL || 'http://localhost:3000';
};

export { getAdminApiUrl };
