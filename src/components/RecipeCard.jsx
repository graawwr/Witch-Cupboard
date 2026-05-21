import { forwardRef } from 'react';
import plantTemplate from '../assets/planttemplate.jpg';

function formatAmt(n) {
  const v = Number(n) || 0;
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(2).replace(/\.?0+$/, '');
}

const RecipeCard = forwardRef(function RecipeCard({ recipe }, ref) {
  if (!recipe) return null;

  const date = recipe.createdAt
    ? new Date(recipe.createdAt).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '';

  return (
    <div ref={ref} className="recipe-card">
      <img
        className="recipe-card-bg"
        src={plantTemplate}
        alt=""
        aria-hidden
        decoding="sync"
      />
      <div className="recipe-card-inner">
        <div className="recipe-card-sheet">
          <h2 className="title">{recipe.title}</h2>
          {recipe.intention ? <p className="intention">{recipe.intention}</p> : null}

          {recipe.ingredients?.length > 0 && (
            <>
              <div className="divider">gathered</div>
              <ul className="ingredients">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>
                    <span className="ing-emoji" aria-hidden>{ing.emoji || '·'}</span>
                    <span className="ing-name">
                      {ing.name}
                      <span className="ing-leader" aria-hidden />
                    </span>
                    <span className="ing-amt">
                      {formatAmt(ing.amount)}{ing.unit ? `\u00A0${ing.unit}` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {recipe.steps?.trim() && (
            <>
              <div className="divider">method</div>
              <p className="steps">{recipe.steps}</p>
            </>
          )}

          <div className="footer">
            {date ? <span className="date">scribed · {date}</span> : null}
          </div>
        </div>
      </div>
    </div>
  );
});

export default RecipeCard;
