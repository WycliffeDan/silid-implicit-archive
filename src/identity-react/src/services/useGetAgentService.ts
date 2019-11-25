import { useEffect, useState } from 'react';
import { Service } from '../types/Service';
import { Agent } from '../types/Agent';

export interface Agents {
  results: Agent[];
}

const useStarshipsService = () => {
  const [result, setResult] = useState<Service<Agents>>({
    status: 'loading'
  });

  const headers = new Headers({ 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`}); 
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}agent`, { headers })
      .then(response => response.json())
      .then(response => setResult({ status: 'loaded', payload: response }))
      .catch(error => setResult({ status: 'error', error }));
  }, []);

  return result;
};

export default useStarshipsService;
