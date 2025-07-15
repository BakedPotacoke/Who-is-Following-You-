//  Handle Dropdown Hamburger Menu
 document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    // Cek apakah elemen-elemen ditemukan di DOM
    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', function() {
        // Toggle (menambah/menghapus) class 'hidden' pada menu mobile
        mobileMenu.classList.toggle('hidden');
      });
    }
  });