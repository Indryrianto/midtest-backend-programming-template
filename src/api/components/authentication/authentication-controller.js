const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

// Simpan informasi tentang percobaan login dan waktu terakhirnya
const loginAttempts = {};

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Periksa apakah email telah mencapai batas percobaan gagal
    if (loginAttempts[email] && loginAttempts[email].attempts >= 5) {
      const elapsedTime = Date.now() - loginAttempts[email].lastAttempt;
      const elapsedMinutes = elapsedTime / (1000 * 60);
      // Jika sudah lebih dari 30 menit, reset percobaan gagal
      if (elapsedMinutes >= 30) {
        delete loginAttempts[email];
        console.log(`[${new Date().toISOString()}] User ${email} bisa mencoba login kembali karena sudah lebih dari 30 menit sejak pengenaan limit. Attempt di-reset kembali ke 0`);
      } else {
        console.log(`[${new Date().toISOString()}] User ${email} mendapat error 403 karena telah melebihi limit attempt.`);
        throw errorResponder(
          errorTypes.FORBIDDEN,
          'Too many failed login attempts. Try again later.'
        );
      }
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      // Tambahkan satu ke percobaan gagal dan perbarui waktu terakhirnya
      const attempts = (loginAttempts[email]?.attempts || 0) + 1;
      loginAttempts[email] = {
        attempts,
        lastAttempt: Date.now(),
        lastAttemptDate: new Date().toISOString(), // Tambahkan waktu percobaan terakhir
        lastAttemptCount: attempts, // Tambahkan jumlah percobaan terakhir
      };
      console.log(`[${new Date().toISOString()}] User ${email} gagal login. Attempt = ${attempts}. Tanggal dan waktu: ${loginAttempts[email].lastAttemptDate}`);
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        `Wrong email or password. Last attempt: ${loginAttempts[email].lastAttemptDate}, Total attempts: ${attempts}`
      );
    }

    // Reset jumlah percobaan gagal untuk email tersebut setelah login berhasil
    delete loginAttempts[email];
    console.log(`[${new Date().toISOString()}] User ${email} berhasil login.`);

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}


module.exports = {
  login,
};
