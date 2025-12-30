import axios from 'axios';

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'x-nesto-candidat': 'Oleh Butakov',
};

export const api = axios.create({
  baseURL: `https://nesto-fe-exam.vercel.app/api`,
  headers: {
    ...DEFAULT_HEADERS,
  },
  timeout: 25000,
});
