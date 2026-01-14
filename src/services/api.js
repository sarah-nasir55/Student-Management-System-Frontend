const API_BASE_URL = 'http://localhost:8080';

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

// Students API
export const studentsAPI = {
  getAll: () => apiRequest('/students'),
  getById: (id) => apiRequest(`/students/${id}`),
  create: (data) => apiRequest('/students', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/students/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/students/${id}`, { method: 'DELETE' }),
};

// Semesters API
export const semestersAPI = {
  getAll: () => apiRequest('/semesters'),
  getById: (id) => apiRequest(`/semesters/${id}`),
  create: (data) => apiRequest('/semesters', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/semesters/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/semesters/${id}`, { method: 'DELETE' }),
};

// Courses API
export const coursesAPI = {
  getAll: () => apiRequest('/courses'),
  getById: (id) => apiRequest(`/courses/${id}`),
  create: (data) => apiRequest('/courses', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/courses/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/courses/${id}`, { method: 'DELETE' }),
};

// Enrollments API
export const enrollmentsAPI = {
  getAll: () => apiRequest('/enrollments'),
  create: (data) => apiRequest('/enrollments', { method: 'POST', body: data }),
};
