import React from 'react';

export function Like({router}) {
    return (
      <div className="vhcenter">
        <h1>Find it</h1>
        <button onClick={() => router.push("/seeyou")} className="positivanswer">
          Got it !
        </button>
        <button onClick={() => router.push("/home")} className="negativanswer">
        I couldn't find it...
        </button>
      </div>
    );
}
