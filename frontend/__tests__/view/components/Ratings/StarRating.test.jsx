import {describe, expect, test, jest} from '@jest/globals';
import {render} from "@testing-library/react";
import StarRating from "../../../../src/view/components/Ratings/StarRating";
import userEvent from '@testing-library/user-event';

describe('StarRating component', () => {
    test('renders with the initial value', () => {
        const { container } = render(<StarRating initialValue={3} />);
        const stars = container.querySelectorAll('.star-active');
        expect(stars.length).toBe(3);
    });

    test('updates rating on click', async () => {
        const handleRatingChange = jest.fn();
        const {container} = render(
            <StarRating initialValue={3} onRatingChange={handleRatingChange}/>
        );
        const fourthStar = container.querySelectorAll('.star')[0];
        await userEvent.click(fourthStar);
        expect(handleRatingChange).toHaveBeenCalledWith(4);
    });

    test('does not update rating when disabled', async () => {
        const handleRatingChange = jest.fn();
        const {container} = render(
            <StarRating initialValue={3} onRatingChange={handleRatingChange} disabled={true}/>
        );
        const fourthStar = container.querySelectorAll('.star')[3];
        await userEvent.click(fourthStar);
        expect(handleRatingChange).not.toHaveBeenCalled();
    });

    test('updates hover state on mouse enter', async () => {
        const { container } = render(<StarRating initialValue={3} />);
        const thirdStar = container.querySelectorAll('.star')[2];
        await userEvent.hover(thirdStar);
        const hoveredStar = container.querySelector('.star-active');
        expect(hoveredStar).toBeTruthy();
    });
})