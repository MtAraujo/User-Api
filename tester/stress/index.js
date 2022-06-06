import { check } from 'k6';
import http from 'k6/http';

const timing = 300

export const options = {
  // httpDebug: 'full',
  stages: [
    { duration: '10s', target: 10 },
    // { duration: '20s', target: 20 },
    // { duration: '30s', target: 30 },
  ],
};

export default function () {
  // const res = http.get(url);

  const req1 = {
    method: 'GET',
    url: 'http://localhost:3000/user',
  }

  const req2 = {
    method: 'GET',
    url: 'http://localhost:3000/user/6268565725d3381c85d98cdf',
  }
  
  const req3 = {
    method: 'POST',
    url: 'http://localhost:3000/user',
    body: JSON.stringify({
        name: "Gustavo Prado-expresss 1",
        email: "contato@contato.com.br"
    }),
    params: {
      headers: { 'Content-Type': 'application/json' },
    },
  }

  const responses = http.batch([req1, req2])

  for (let index = 0; index < responses.length; index++) {
    const element = responses[index];
    check(element, {
      'is status 200': (r) => r.status === 200,
      'is timings request duration': (r) => r.timings.duration <= timing,
    })
  }

}