import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetch = (
  requester: (options: object) => Promise<object>,
  options: object,
  dependencyArr: Array<any>,
  initial: any
) => {
  const [response, setResponse] = useState(initial);
  const [error, setError] = useState<null | object>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const source = axios.CancelToken.source();
    setLoading(true);
    requester({ ...options, cancelToken: source.token })
      .then(res => {
        setResponse(res);
        setError(null);
        setLoading(false);
      })
      .catch(err => {
        if (!axios.isCancel(err)) {
          console.log(123123);
          setError(err);
          setLoading(false);
        }
      });
    return () => {
      source.cancel();
    };
  }, dependencyArr);
  return [response, loading, error];
};

export default useFetch;
