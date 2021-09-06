// Write your code here
import './index.css'

const LanguageFilterItem = props => {
  const {languageFilterItem, onChangeFilterData, isActive} = props
  const {id, language} = languageFilterItem
  const btnClassName = isActive
    ? 'language-btn active-language-btn'
    : 'language-btn'
  const onClickFilterData = () => {
    onChangeFilterData(id)
  }

  return (
    <li>
      <button
        type="button"
        onClick={onClickFilterData}
        className={btnClassName}
      >
        {language}
      </button>
    </li>
  )
}
export default LanguageFilterItem
