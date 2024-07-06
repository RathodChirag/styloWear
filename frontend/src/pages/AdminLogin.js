import React from 'react';
import '../App.css';

export default function AdminLogin() {
    return (
        <div className="gradient-bg d-flex justify-content-center align-items-center min-vh-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow-lg p-4">
                            <div className="card-body">
                                <h3 className="card-title text-center mb-4" style={{ color: "#000fff" }}>Admin Login</h3>
                                <form>
                                    <div className="mb-3 position-relative">
                                        <label htmlFor="email" className="form-label">Email address</label>
                                        <input type="email" className="form-control input-lg" id="email" />
                                    </div>
                                    <div className="mb-3 position-relative">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input type="password" className="form-control input-lg" id="password" />
                                    </div>
                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-primary btn-block">Login</button>
                                    </div>
                                    <div className="mt-3 text-center">
                                        <small><a href="/forgot-password" className="text-decoration-none">Forgot password?</a></small>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}