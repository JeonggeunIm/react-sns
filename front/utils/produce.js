// enableES5 -> IE@11에서 사용 가능하도록 해주는 역할
import produce, { enableES5 } from 'immer';

const produceExtension = (...args) => {
  // produce 확장 -> 시작전에 enableES5 실행 될 수 있도록
  enableES5();
  return produce(...args);
};

export default produceExtension;
