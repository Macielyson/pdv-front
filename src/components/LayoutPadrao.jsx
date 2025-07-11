import Header from './Header';
import Sidebar from './Sidebar';

const LayoutPadrao = ({ children }) => {
  return (
    <>
      <Header />
      <div className="container-fluid h-100">
        <div className="row h-100">
          <Sidebar />
          <div className="col p-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default LayoutPadrao;
