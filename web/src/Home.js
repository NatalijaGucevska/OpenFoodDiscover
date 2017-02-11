import React from 'react';
import Cards, { Card } from 'react-swipe-card';
import { render } from 'react-dom';
import { Link } from 'react-router';

const data = [{
  title: "Celery",
  img: "celery.jpg"
}]

export function Home({router, propositions, onSwipeCard, currentCardIndex}) {
  console.log(propositions)
  const current = propositions[currentCardIndex]
    return (
          <div>
            <Cards onEnd={ () => onSwipeCard() } className='master-root'>
              {[current].map(item =>
                  <Card
                    onSwipeLeft={() => router.push("/dontlike")}
                    onSwipeRight={() => router.push("/like")} >
                    <img src={item.image} />

                    <h2 className="productTitle">{item.name}</h2>

                  </Card>
              )}
            </Cards>

            <button onClick={() => router.push("/dontlike")} className="swipeLeft">
              <img className="vhcenter" src="img/cross.svg"/>
            </button>

            <button onClick={() => router.push("/like")} className="swipeRight">
              <img className="vhcenter" src="img/handsup.svg"/>
            </button>



          </div>
    );
}
