import {Component} from 'react'
import Loader from 'react-loader-spinner'

import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'

import './index.css'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

const githubConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class GithubPopularRepos extends Component {
  state = {
    repositoryItemList: [],
    activeFilterData: languageFiltersData[0].id,
    gitHubStatus: githubConstants.initial,
  }

  componentDidMount() {
    this.getRepositoryItems()
  }

  getRepositoryItems = async () => {
    this.setState({gitHubStatus: githubConstants.loading})
    const {activeFilterData} = this.state
    const url = `https://apis.ccbp.in/popular-repos?language=${activeFilterData}`
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok === true) {
      const updatedItems = data.popular_repos.map(each => ({
        id: each.id,
        avatarUrl: each.avatar_url,
        name: each.name,
        starsCount: each.stars_count,
        forksCount: each.forks_count,
        issuesCount: each.issues_count,
      }))
      this.setState({
        repositoryItemList: updatedItems,
        gitHubStatus: githubConstants.success,
      })
    } else if (response.status === 401) {
      this.setState({
        gitHubStatus: githubConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => {
    const {repositoryItemList} = this.state
    return (
      <ul className="repositories-cards-list-container">
        {repositoryItemList.map(each => (
          <RepositoryItem key={each.id} repositoryItem={each} />
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div>
      <img
        className="error-img"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="error-message">Something Went Wrong</h1>
    </div>
  )

  renderPopularRepos = () => {
    const {gitHubStatus} = this.state
    switch (gitHubStatus) {
      case githubConstants.success:
        return this.renderSuccessView()
      case githubConstants.failure:
        return this.renderFailureView()
      case githubConstants.loading:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onChangeFilterData = activeFilterData => {
    this.setState({activeFilterData}, this.getRepositoryItems)
  }

  render() {
    const {activeFilterData} = this.state
    return (
      <div className="app-container">
        <div className="git-hub-repos-container">
          <h1 className="heading">POPULAR</h1>
          <ul className="language-filter-container">
            {languageFiltersData.map(eachLanguage => (
              <LanguageFilterItem
                languageFilterItem={eachLanguage}
                key={eachLanguage.id}
                onChangeFilterData={this.onChangeFilterData}
                isActive={eachLanguage.id === activeFilterData}
              />
            ))}
          </ul>
          {this.renderPopularRepos()}
        </div>
      </div>
    )
  }
}
export default GithubPopularRepos
