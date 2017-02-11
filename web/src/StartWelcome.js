import React from 'react';

export function StartWelcome({router}) {
  setTimeout(function() { router.push("/StartTry"); }, 3000);
    return (
        <h1 className="vhcenter">Welcome Back</h1>
    );
}
