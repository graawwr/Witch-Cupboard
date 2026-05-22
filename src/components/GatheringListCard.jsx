import { forwardRef } from 'react';
import plantTemplate from '../assets/planttemplate.jpg';

function formatAmt(n) {
  const v = Number(n) || 0;
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(2).replace(/\.?0+$/, '');
}

const GatheringListCard = forwardRef(function GatheringListCard({ items, createdAt }, ref) {
  if (!items?.length) return null;

  const date = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : new Date().toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric',
      });

  return (
    <div ref={ref} className="recipe-card gathering-list-card">
      <img
        className="recipe-card-bg"
        src={plantTemplate}
        alt=""
        aria-hidden
        decoding="sync"
      />
      <div className="recipe-card-inner">
        <div className="recipe-card-sheet">
          <h2 className="title">Gathering List</h2>
          <p className="intention">What to bring back to the cupboard</p>

          <div className="divider">to gather</div>
          <ul className="ingredients">
            {items.map((item) => (
              <li key={item.itemId || item.name}>
                <span className="ing-emoji" aria-hidden>{item.emoji || '·'}</span>
                <span className="ing-name">
                  {item.name}
                  <span className="ing-leader" aria-hidden />
                </span>
                <span className="ing-amt">
                  {formatAmt(item.amount)}{item.unit ? `\u00A0${item.unit}` : ''}
                </span>
              </li>
            ))}
          </ul>

          <div className="footer">
            <span className="date">gathered · {date}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default GatheringListCard;
