import React from 'react';

// Link 컴포넌트를 a 태그로 대체
export const Link = ({ to, children, ...props }) => {
  return React.createElement('a', {
    href: to,
    onClick: (e) => {
      e.preventDefault();
      console.log('Navigate to:', to);
      if (props.onClick) props.onClick(e);
    },
    ...props
  }, children);
};

// 기타 react-router 컴포넌트들
export const useNavigate = () => (path) => console.log('Navigate to:', path);
export const useLocation = () => ({ pathname: '/', search: '', hash: '' });
export const useParams = () => ({});
export const useSearchParams = () => [new URLSearchParams(), () => {}];