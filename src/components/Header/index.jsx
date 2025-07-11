import React from 'react';

const Header = () => {
  return (
    <header className="container-fluid d-flex justify-content-end bg-secondary">
      <div className="d-flex align-items-center">
        <div className='d-flex text-right m-2'>
          <img src="https://cdn-icons-png.flaticon.com/512/9187/9187532.png" width="30" height="30" />
          <h5 className="">Macielyson Nascimento</h5>
        </div>
      </div>
    </header>
  );
};

export default Header;
