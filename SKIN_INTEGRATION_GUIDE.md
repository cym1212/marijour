 # 스킨 통합 가이드

## Product Slider Skin

### 컨테이너 스타일 요구사항
ProductSliderSkin이 원본과 동일하게 표시되려면 다음 컨테이너 스타일이 필요합니다:

```css
.skin-container {
    max-width: 1400px;
    margin: 0 auto;
    padding-left: 20px;
    padding-right: 20px;
}

@media (min-width: 768px) {
    .skin-container {
        padding-left: 40px;
        padding-right: 40px;
    }
}
```

### 중요 사항
- 스킨 컴포넌트는 전역 CSS를 포함하지 않습니다
- 웹빌더 환경에 영향을 주지 않도록 설계되었습니다
- 레이아웃 스타일은 웹빌더 측에서 제공해야 합니다