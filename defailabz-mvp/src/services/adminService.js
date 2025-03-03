export const adminService = {
    // Credenciais de teste (em produção, isso viria do backend)
    adminUsers: [
      { username: 'admin', password: 'admin123' }
    ],
  
    login: async (credentials) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = adminService.adminUsers.find(
            u => u.username === credentials.username && 
                u.password === credentials.password
          );
  
          if (user) {
            resolve({ 
              success: true, 
              token: 'admin_token_' + Date.now() 
            });
          } else {
            reject(new Error('Credenciais inválidas'));
          }
        }, 1000);
      });
    },
  
    validateToken: () => {
      const token = localStorage.getItem('admin_token');
      return !!token;
    }
  };