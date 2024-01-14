import { useState } from 'react';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface StarRatingProps {
    initialValue: number;
    onRatingChange?: (rating: number) => void;
    disabled?: boolean;
}

function StarRating(props: StarRatingProps) {
    const [rating, setRating] = useState<number>(props.initialValue);
    const [hover, setHover] = useState<number | null>(null);

    const handleClick = (ratingValue: number) => {
        if (!props.disabled) {
            setRating(ratingValue);
            if (props.onRatingChange) props.onRatingChange(ratingValue);
        }
    };

    const handleMouseEnter = (ratingValue: number) => {
        if (!props.disabled) {
            setHover(ratingValue);
        }
    };

    return (
        <div>
            {[...Array(5)].map((_star, index) => {
                const ratingValue = index + 1;
                const starClass = ratingValue <= (hover || rating) ? `star-active` : 'star';

                return (
                    <label key={index}>
                        <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => handleClick(ratingValue)}
                            style={{ display: 'none' }}
                            disabled={props.disabled}
                        />
                        <FontAwesomeIcon
                            icon={faStar}
                            className={starClass}
                            size="1x"
                            onMouseEnter={() => handleMouseEnter(ratingValue)}
                            onMouseLeave={() => setHover(null)}
                        />
                    </label>
                );
            })}
        </div>
    );
}

export default StarRating;
