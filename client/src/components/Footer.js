import React from 'react';

export const Footer = ({ status }) => {
    return (
        <footer className="footer">
            <div className="content has-text-centered">
                <p>
                    <strong>Quiteoften</strong> - {status.message}
                </p>
            </div>
        </footer>
    )
};