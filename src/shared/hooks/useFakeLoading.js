/**
 * useFakeLoading — standardized fake loading delay for skeleton screens.
 * Replaces the 35+ inline setTimeout/setIsLoading patterns scattered through the codebase.
 *
 * When real async data loading is implemented, replace this hook per screen with
 * the actual async state (isLoading from API call), with zero other changes required.
 *
 * @param {number} ms - Delay in milliseconds (default: 400)
 * @param {any} resetKey - Optional dep that re-triggers loading (e.g. chat?.id)
 */
import { useState, useEffect } from 'react';

export const useFakeLoading = (ms = 400, resetKey = undefined) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), ms);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);
  return isLoading;
};

export default useFakeLoading;
