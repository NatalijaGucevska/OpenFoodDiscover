import React from 'react';

export function StartLogo({router}) {
  setTimeout(function() { router.push("/StartWelcome"); }, 2000);
    return (
        <img id="logo" className="vhcenter" src="img/wisepick_logo.svg" />
    );
}
