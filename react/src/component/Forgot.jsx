import React from 'react'

const Forgot = () => {
    const click = (e) => {
        e.preventDefault();
      };
  return (
    <div className="container mt-4">
    <div className="row justify-content-center">
      <div className="col-lg-4 bg-light p-4 rounded shadow">
        <h3 className="text-center mb-4">Forget Your Password</h3>
        <form>
        
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input type="email" className="form-control" id="email" />
          </div>
          <div className="d-grid gap-2">
            <button type="submit" onClick={click} className="btn btn-primary">Send</button>
          </div>
        </form>
        
      </div>
    </div>
  </div>
  )
}

export default Forgot
