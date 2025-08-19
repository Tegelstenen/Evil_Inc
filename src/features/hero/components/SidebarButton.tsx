import React from "react";
import styled from "styled-components";

const Button = ({
	children,
	onClick,
}: {
	children: React.ReactNode;
	onClick: () => void;
}) => {
	return (
		<StyledWrapper>
			<button className="btn" onClick={onClick}>
				{children}
				{/* Removed the SVG arrow */}
			</button>
		</StyledWrapper>
	);
};

const StyledWrapper = styled.div`
	.btn {
		width: 140px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center; /* Changed from space-evenly to center since we removed the icon */
		text-transform: uppercase;
		letter-spacing: 1px;
		border: none;
		position: relative;
		background-color: transparent;
		transition: 0.2s cubic-bezier(0.19, 1, 0.22, 1);
		opacity: 0.6;
		color: #fff;
	}

	.btn::after {
		content: "";
		border-bottom: 3px double rgb(249, 0, 0);
		width: 0;
		height: 100%;
		position: absolute;
		margin-top: -5px;
		top: 0;
		left: 5px;
		visibility: hidden;
		opacity: 1;
		transition: 0.2s linear;
	}

	/* Removed .btn .icon styles since we no longer have the icon */

	.btn:hover::after {
		visibility: visible;
		opacity: 0.7;
		width: 90%;
	}

	.btn:hover {
		letter-spacing: 2px;
		opacity: 1;
	}

	/* Removed .btn:hover > .icon styles since we no longer have the icon */

	/* Removed @keyframes attention since it's no longer needed */
`;

export default Button;
