import React from 'react';

export function DontLike({router}) {
    return (
      <div className="vhcenter">
        <h1>But...why?</h1>
        <button onClick={() => router.push("/home")} className="negativanswer">
          Mood
        </button>
        <button onClick={() => router.push("/home")} className="negativanswer">
          Taste
        </button>
        <button onClick={() => router.push("/home")} className="negativanswer">
          Allergies
        </button>
      </div>
    );
}
