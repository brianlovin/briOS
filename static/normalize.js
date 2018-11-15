// @flow
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    border: 0;
    box-sizing: inherit;
    -webkit-font-smoothing: antialiased;
    font-weight: inherit;
    margin: 0;
    outline: 0;
    padding: 0;
    text-decoration: none;
    text-rendering: optimizeLegibility;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  html {
    display: flex;
    height: 100%;
    width: 100%;
    max-height: 100%;
    max-width: 100%;
    box-sizing: border-box;
    font-size: 16px;
    line-height: 1.5;
    background-color: #f6f7f8;
    color: #16171a;
    padding: 0;
    margin: 0;
    -webkit-font-smoothing: antialiased;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  }

  body {
    margin: 0;
    width: 100%;
    height: 100%;
  }

  #__next {
    height: 100%;
  }

  a {
    color: currentColor;
    text-decoration: none;
    background-color: transparent;
  }

  a:hover {
    cursor: pointer;
  }

  ::-moz-selection {
    /* Code for Firefox */
    background: #067AE4;
    color: #ffffff;
  }

  ::selection {
    background: #067AE4;
    color: #ffffff;
  }

  ::-webkit-input-placeholder {
    /* WebKit, Blink, Edge */
    color: #a3afbf;
  }
  :-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #a3afbf;
    opacity: 1;
  }
  ::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #a3afbf;
    opacity: 1;
  }
  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #a3afbf;
  }

  body {
    margin: 0;
  }

  hr {
    box-sizing: content-box;
    height: 0;
    overflow: visible;
  }

  pre {
    font-family: monospace, monospace;
    font-size: 1em;
  }

  abbr[title] {
    border-bottom: none;
    text-decoration: underline;
    text-decoration: underline dotted;
  }

  b,
  strong {
    font-weight: bolder;
  }

  code,
  kbd,
  samp {
    font-family: monospace, monospace;
    font-size: 1em;
  }

  small {
    font-size: 80%;
  }

  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  sub {
    bottom: -0.25em;
  }

  sup {
    top: -0.5em;
  }

  img {
    border-style: none;
  }

  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
  }

  button,
  input {
    overflow: visible;
  }

  button,
  select {
    text-transform: none;
  }

  button,
  [type="button"],
  [type="reset"],
  [type="submit"] {
    -webkit-appearance: button;
  }

  button::-moz-focus-inner,
  [type="button"]::-moz-focus-inner,
  [type="reset"]::-moz-focus-inner,
  [type="submit"]::-moz-focus-inner {
    border-style: none;
    padding: 0;
  }

  button:-moz-focusring,
  [type="button"]:-moz-focusring,
  [type="reset"]:-moz-focusring,
  [type="submit"]:-moz-focusring {
    outline: 1px dotted ButtonText;
  }

  fieldset {
    padding: 0.35em 0.75em 0.625em;
  }

  legend {
    box-sizing: border-box;
    color: inherit;
    display: table;
    max-width: 100%;
    padding: 0;
    white-space: normal;
  }

  progress {
    vertical-align: baseline;
  }

  textarea {
    overflow: auto;
  }

  [type="checkbox"],
  [type="radio"] {
    box-sizing: border-box;
    padding: 0;
  }

  [type="number"]::-webkit-inner-spin-button,
  [type="number"]::-webkit-outer-spin-button {
    height: auto;
  }

  [type="search"] {
    -webkit-appearance: none;
    outline-offset: -2px;
  }

  [type="search"]::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-file-upload-button {
    -webkit-appearance: button;
    font: inherit;
  }

  details {
    display: block;
  }

  summary {
    display: list-item;
  }

  template {
    display: none;
  }

  [hidden] {
    display: none;
  }

  audio {
    display: block;
    margin-top: 16px;
    width: 100%;
  }

  /* algolia */
  .ais-Breadcrumb-list,.ais-CurrentRefinements-list,.ais-HierarchicalMenu-list,.ais-Hits-list,.ais-InfiniteHits-list,.ais-InfiniteResults-list,.ais-Menu-list,.ais-NumericMenu-list,.ais-Pagination-list,.ais-RatingMenu-list,.ais-RefinementList-list,.ais-Results-list,.ais-ToggleRefinement-list{margin:0;padding:0;list-style:none}.ais-ClearRefinements-button,.ais-CurrentRefinements-delete,.ais-CurrentRefinements-reset,.ais-HierarchicalMenu-showMore,.ais-InfiniteHits-loadMore,.ais-InfiniteResults-loadMore,.ais-Menu-showMore,.ais-RangeInput-submit,.ais-RefinementList-showMore,.ais-SearchBox-reset,.ais-SearchBox-submit{padding:0;overflow:visible;font:inherit;line-height:normal;color:inherit;background:none;border:0;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.ais-ClearRefinements-button::-moz-focus-inner,.ais-CurrentRefinements-delete::-moz-focus-inner,.ais-CurrentRefinements-reset::-moz-focus-inner,.ais-HierarchicalMenu-showMore::-moz-focus-inner,.ais-InfiniteHits-loadMore::-moz-focus-inner,.ais-InfiniteResults-loadMore::-moz-focus-inner,.ais-Menu-showMore::-moz-focus-inner,.ais-RangeInput-submit::-moz-focus-inner,.ais-RefinementList-showMore::-moz-focus-inner,.ais-SearchBox-reset::-moz-focus-inner,.ais-SearchBox-submit::-moz-focus-inner{padding:0;border:0}.ais-ClearRefinements-button[disabled],.ais-CurrentRefinements-delete[disabled],.ais-CurrentRefinements-reset[disabled],.ais-HierarchicalMenu-showMore[disabled],.ais-InfiniteHits-loadMore[disabled],.ais-InfiniteResults-loadMore[disabled],.ais-Menu-showMore[disabled],.ais-RangeInput-submit[disabled],.ais-RefinementList-showMore[disabled],.ais-SearchBox-reset[disabled],.ais-SearchBox-submit[disabled]{cursor:default}.ais-Breadcrumb-item,.ais-Breadcrumb-list,.ais-Pagination-list,.ais-PoweredBy,.ais-RangeInput-form,.ais-RatingMenu-link{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.ais-HierarchicalMenu-list .ais-HierarchicalMenu-list{margin-left:1em}.ais-PoweredBy-logo{display:block;width:70px;height:auto}.ais-RatingMenu-starIcon{display:block;width:20px;height:20px}.ais-SearchBox-input::-ms-clear,.ais-SearchBox-input::-ms-reveal{display:none;width:0;height:0}.ais-SearchBox-input::-webkit-search-cancel-button,.ais-SearchBox-input::-webkit-search-decoration,.ais-SearchBox-input::-webkit-search-results-button,.ais-SearchBox-input::-webkit-search-results-decoration{display:none}.ais-RangeSlider .rheostat{overflow:visible;margin-top:40px;margin-bottom:40px}.ais-RangeSlider .rheostat-background{height:6px;top:0;width:100%}.ais-RangeSlider .rheostat-handle{margin-left:-12px;top:-7px}.ais-RangeSlider .rheostat-background{position:relative;background-color:#fff;border:1px solid #aaa}.ais-RangeSlider .rheostat-progress{position:absolute;top:1px;height:4px;background-color:#333}.rheostat-handle{position:relative;z-index:1;width:20px;height:20px;background-color:#fff;border:1px solid #333;border-radius:50%;cursor:-webkit-grab;cursor:grab}.rheostat-marker{margin-left:-1px;position:absolute;width:1px;height:5px;background-color:#aaa}.rheostat-marker--large{height:9px}.rheostat-value{padding-top:15px}.rheostat-tooltip,.rheostat-value{margin-left:50%;position:absolute;text-align:center;-webkit-transform:translateX(-50%);transform:translateX(-50%)}.rheostat-tooltip{top:-22px}[class^=ais-]{font-size:1rem;box-sizing:border-box}a[class^=ais-]{text-decoration:none}.ais-Breadcrumb,.ais-ClearRefinements,.ais-CurrentRefinements,.ais-HierarchicalMenu,.ais-Hits,.ais-HitsPerPage,.ais-InfiniteHits,.ais-InfiniteResults,.ais-Menu,.ais-MenuSelect,.ais-NumericMenu,.ais-NumericSelector,.ais-Pagination,.ais-Panel,.ais-PoweredBy,.ais-RangeInput,.ais-RangeSlider,.ais-RatingMenu,.ais-RefinementList,.ais-Results,.ais-ResultsPerPage,.ais-SearchBox,.ais-SortBy,.ais-Stats,.ais-ToggleRefinement{color:#3a4570}.ais-Breadcrumb-item--selected,.ais-HierarchicalMenu-item--selected,.ais-Menu-item--selected{font-weight:700}.ais-Breadcrumb-separator{margin:0 .3em;font-weight:400}.ais-Breadcrumb-link,.ais-HierarchicalMenu-link,.ais-Menu-link,.ais-Pagination-link,.ais-RatingMenu-link{color:#0096db;transition:color .2s ease-out}.ais-Breadcrumb-link:focus,.ais-Breadcrumb-link:hover,.ais-HierarchicalMenu-link:focus,.ais-HierarchicalMenu-link:hover,.ais-Menu-link:focus,.ais-Menu-link:hover,.ais-Pagination-link:focus,.ais-Pagination-link:hover,.ais-RatingMenu-link:focus,.ais-RatingMenu-link:hover{color:#0073a8}.ais-ClearRefinements-button,.ais-CurrentRefinements-reset,.ais-HierarchicalMenu-showMore,.ais-InfiniteHits-loadMore,.ais-InfiniteResults-loadMore,.ais-Menu-showMore,.ais-RefinementList-showMore{padding:.3rem .5rem;font-size:.8rem;color:#fff;background-color:#0096db;border-radius:5px;transition:background-color .2s ease-out;outline:none}.ais-ClearRefinements-button:focus,.ais-ClearRefinements-button:hover,.ais-CurrentRefinements-reset:focus,.ais-CurrentRefinements-reset:hover,.ais-HierarchicalMenu-showMore:focus,.ais-HierarchicalMenu-showMore:hover,.ais-InfiniteHits-loadMore:focus,.ais-InfiniteHits-loadMore:hover,.ais-InfiniteResults-loadMore:focus,.ais-InfiniteResults-loadMore:hover,.ais-Menu-showMore:focus,.ais-Menu-showMore:hover,.ais-RefinementList-showMore:focus,.ais-RefinementList-showMore:hover{background-color:#0073a8}.ais-ClearRefinements-button--disabled,.ais-HierarchicalMenu-showMore--disabled,.ais-InfiniteHits-loadMore--disabled,.ais-InfiniteResults-loadMore--disabled,.ais-Menu-showMore--disabled,.ais-RefinementList-showMore--disabled{opacity:.6;cursor:not-allowed}.ais-ClearRefinements-button--disabled:focus,.ais-ClearRefinements-button--disabled:hover,.ais-HierarchicalMenu-showMore--disabled:focus,.ais-HierarchicalMenu-showMore--disabled:hover,.ais-InfiniteHits-loadMore--disabled:focus,.ais-InfiniteHits-loadMore--disabled:hover,.ais-InfiniteResults-loadMore--disabled:focus,.ais-InfiniteResults-loadMore--disabled:hover,.ais-Menu-showMore--disabled:focus,.ais-Menu-showMore--disabled:hover,.ais-RefinementList-showMore--disabled:focus,.ais-RefinementList-showMore--disabled:hover{background-color:#0096db}.ais-CurrentRefinements{margin-top:-.3rem}.ais-CurrentRefinements,.ais-CurrentRefinements-list{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap}.ais-CurrentRefinements-item{margin-right:.3rem;margin-top:.3rem;padding:.3rem .5rem;display:-webkit-box;display:-ms-flexbox;display:flex;background-color:#495588;border-radius:5px}.ais-CurrentRefinements-category{margin-left:.3em;display:-webkit-box;display:-ms-flexbox;display:flex}.ais-CurrentRefinements-delete{margin-left:.3rem}.ais-CurrentRefinements-categoryLabel,.ais-CurrentRefinements-delete,.ais-CurrentRefinements-label{white-space:nowrap;font-size:.8rem;color:#fff}.ais-CurrentRefinements-reset{margin-top:.3rem;white-space:nowrap}.ais-CurrentRefinements-reset+.ais-CurrentRefinements-list{margin-left:.3rem}.ais-HierarchicalMenu-link,.ais-Menu-link{display:block;line-height:1.5}.ais-HierarchicalMenu-list,.ais-Menu-list,.ais-NumericMenu-list,.ais-RatingMenu-list,.ais-RefinementList-list{font-weight:400;line-height:1.5}.ais-HierarchicalMenu-link:after{margin-left:.3em;content:"";width:10px;height:10px;display:none;background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M7.33 24L4.5 21.171l9.339-9.175L4.5 2.829 7.33 0 19.5 11.996z' fill='%233A4570'/%3E%3C/svg%3E");background-size:100% 100%}.ais-HierarchicalMenu-item--parent>.ais-HierarchicalMenu-link:after{display:inline-block}.ais-HierarchicalMenu-item--selected>.ais-HierarchicalMenu-link:after{-webkit-transform:rotate(90deg);transform:rotate(90deg)}.ais-CurrentRefinements-count,.ais-RatingMenu-count{font-size:.8rem}.ais-CurrentRefinements-count:before,.ais-RatingMenu-count:before{content:"("}.ais-CurrentRefinements-count:after,.ais-RatingMenu-count:after{content:")"}.ais-HierarchicalMenu-count,.ais-Menu-count,.ais-RefinementList-count,.ais-ToggleRefinement-count{padding:.1rem .4rem;font-size:.8rem;color:#3a4570;background-color:#dfe2ee;border-radius:8px}.ais-HierarchicalMenu-showMore,.ais-Menu-showMore,.ais-RefinementList-showMore{margin-top:.5rem}.ais-Highlight-highlighted,.ais-Snippet-highlighted{background-color:#ffc168}.ais-Hits-list,.ais-InfiniteHits-list,.ais-InfiniteResults-list,.ais-Results-list{margin-top:-1rem;margin-left:-1rem;display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap}.ais-Panel-body .ais-Hits-list,.ais-Panel-body .ais-InfiniteHits-list,.ais-Panel-body .ais-InfiniteResults-list,.ais-Panel-body .ais-Results-list{margin:.5rem 0 0 -1rem}.ais-Hits-item,.ais-InfiniteHits-item,.ais-InfiniteResults-item,.ais-Results-item{margin-top:1rem;margin-left:1rem;padding:1rem;width:calc(25% - 1rem);border:1px solid #c4c8d8;box-shadow:0 2px 5px 0 #e3e5ec}.ais-Panel-body .ais-Hits-item,.ais-Panel-body .ais-InfiniteHits-item,.ais-Panel-body .ais-InfiniteResults-item,.ais-Panel-body .ais-Results-item{margin:.5rem 0 .5rem 1rem}.ais-InfiniteHits-loadMore,.ais-InfiniteResults-loadMore{margin-top:1rem}.ais-HitsPerPage-select,.ais-MenuSelect-select,.ais-NumericSelector-select,.ais-ResultsPerPage-select,.ais-SortBy-select{-webkit-appearance:none;-moz-appearance:none;appearance:none;padding:.3rem 2rem .3rem .3rem;background-color:#fff;background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M0 7.33L2.829 4.5l9.175 9.339L21.171 4.5 24 7.33 12.004 19.5z' fill='%233A4570'/%3E%3C/svg%3E");background-repeat:no-repeat;background-size:10px 10px;background-position:92% 50%;border:1px solid #c4c8d8;border-radius:5px}.ais-Panel-header{margin-bottom:.5rem;padding-bottom:.5rem;font-size:.8rem;font-weight:700;text-transform:uppercase;border-bottom:1px solid #c4c8d8}.ais-Panel-footer{margin-top:.5rem;font-size:.8rem}.ais-RangeInput-input{padding:0 .2rem;width:5rem;height:1.5rem;line-height:1.5rem}.ais-RangeInput-separator{margin:0 .3rem}.ais-RangeInput-submit{margin-left:.3rem;-webkit-appearance:none;-moz-appearance:none;appearance:none;padding:0 .5rem;height:1.5rem;line-height:1.5rem;font-size:.8rem;color:#fff;background-color:#0096db;border:none;border-radius:5px;transition:.2s ease-out;outline:none}.ais-RangeInput-submit:focus,.ais-RangeInput-submit:hover{background-color:#0073a8}.ais-RatingMenu-count{color:#3a4570}.ais-Pagination-list{-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}.ais-Pagination-item+.ais-Pagination-item{margin-left:.3rem}.ais-Pagination-link{padding:.3rem .6rem;display:block;border:1px solid #c4c8d8;border-radius:5px;transition:background-color .2s ease-out}.ais-Pagination-link:focus,.ais-Pagination-link:hover{background-color:#e3e5ec}.ais-Pagination-item--disabled .ais-Pagination-link{opacity:.6;cursor:not-allowed;color:#a5abc4}.ais-Pagination-item--disabled .ais-Pagination-link:focus,.ais-Pagination-item--disabled .ais-Pagination-link:hover{color:#a5abc4;background-color:#fff}.ais-Pagination-item--selected .ais-Pagination-link{color:#fff;background-color:#0096db;border-color:#0096db}.ais-Pagination-item--selected .ais-Pagination-link:focus,.ais-Pagination-item--selected .ais-Pagination-link:hover{color:#fff}.ais-PoweredBy-text,.ais-Stats-text,.rheostat-tooltip,.rheostat-value{font-size:.8rem}.ais-PoweredBy-logo{margin-left:.3rem}.ais-RangeSlider .rheostat-progress{background-color:#495588}.ais-RangeSlider .rheostat-background{border-color:#878faf;box-sizing:border-box}.ais-RangeSlider .rheostat-handle{border-color:#878faf}.ais-RangeSlider .rheostat-marker{background-color:#878faf}.ais-Panel-body .ais-RangeSlider{margin:2rem 0}.ais-RatingMenu-item--disabled .ais-RatingMenu-count,.ais-RatingMenu-item--disabled .ais-RatingMenu-label{color:#c4c8d8}.ais-RatingMenu-item--selected{font-weight:700}.ais-RatingMenu-link{line-height:1.5}.ais-RatingMenu-link>*+*{margin-left:.3rem}.ais-RatingMenu-starIcon{position:relative;top:-1px;width:15px;fill:#ffc168}.ais-RatingMenu-item--disabled .ais-RatingMenu-starIcon{fill:#c4c8d8}.ais-HierarchicalMenu-searchBox>*,.ais-Menu-searchBox>*,.ais-RefinementList-searchBox>*{margin-bottom:.5rem}.ais-SearchBox-form{display:block;position:relative}.ais-SearchBox-input{-webkit-appearance:none;-moz-appearance:none;appearance:none;padding:.3rem 1.7rem;width:100%;position:relative;background-color:#fff;border:1px solid #c4c8d8;border-radius:5px}.ais-SearchBox-input::-webkit-input-placeholder{color:#a5aed1}.ais-SearchBox-input::-moz-placeholder{color:#a5aed1}.ais-SearchBox-input:-ms-input-placeholder{color:#a5aed1}.ais-SearchBox-input:-moz-placeholder{color:#a5aed1}.ais-SearchBox-loadingIndicator,.ais-SearchBox-reset,.ais-SearchBox-submit{-webkit-appearance:none;-moz-appearance:none;appearance:none;position:absolute;z-index:1;width:20px;height:20px;top:50%;right:.3rem;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.ais-SearchBox-submit{left:.3rem}.ais-SearchBox-reset{right:.3rem}.ais-SearchBox-loadingIcon,.ais-SearchBox-resetIcon,.ais-SearchBox-submitIcon{position:absolute;top:50%;left:50%;-webkit-transform:translateX(-50%) translateY(-50%);transform:translateX(-50%) translateY(-50%)}.ais-SearchBox-resetIcon path,.ais-SearchBox-submitIcon path{fill:#495588}.ais-SearchBox-submitIcon{width:14px;height:14px}.ais-SearchBox-resetIcon{width:12px;height:12px}.ais-SearchBox-loadingIcon{width:16px;height:16px}
  .ais-InstantSearch__root {
    width: 100%;
    position: relative;

    input {
      border-radius: 4px;
    }
  }

  .ais-Hits {
    position: absolute;
    top: 48px;
    left: 50%;
    width: 50%;
    height: 100%;
    transform: translateX(-50%);
    width: 100%;
    background: #FFF;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transition: all 0.2s ease-in-out;
    border-radius: 4px;
    z-index: 999;
    display: flex;
    flex-direction: column;
    flex: none;
    height: auto;
    max-height: 400px;
    overflow-y: scroll;
    max-width: 100%;
  }

  @media (max-width: 968px) {
    .ais-Hits {
      -webkit-overflow-scrolling: touch;
      top: 54px;
    }
  }

  .ais-Hits-list {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    margin: 0;
    height: auto;
  }

  .ais-Hits-item {
    display: flex;
    flex: 1 0 auto;
    width: 100%;
    padding: 0;
    margin: 0;
    border: 0!important;
    box-shadow: none;
    cursor: pointer;
  }

  .ais-Hits-item a {
    width: 100%;
  }

  .ais-Hits-item > div {
    padding: 0!important;
    margin: 0!important;
    border: 0!important;
  }

  .ais-Hits-item:last-of-type section {
    border-bottom: 0;
  }

  #nprogress .spinner {
    display: none!important;
  }
`;