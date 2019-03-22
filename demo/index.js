import { createElement, render, hydrate, Component, options, Fragment } from 'preact';
import { useState, useEffect } from 'preact/hooks'
// import renderToString from 'preact-render-to-string';
import './style.scss';
import { Router, Link } from './router';
import Pythagoras from './pythagoras';
import Spiral from './spiral';
import Reorder from './reorder';
import Todo from './todo';
import Fragments from './fragments';
import Context from './context';
import installLogger from './logger';
import ProfilerDemo from './profiler';
import KeyBug from './key_bug';
import { initDevTools } from 'preact/debug/src/devtools';
import DevtoolsDemo from './devtools';

let isBenchmark = /(\/spiral|\/pythagoras|[#&]bench)/g.test(window.location.href);
if (!isBenchmark) {
	// eslint-disable-next-line no-console
	console.log('Enabling devtools');
	// initDevTools();
}

class Home extends Component {
	a = 1;
	render() {
		return (
			<div>
				<h1>Hello</h1>
			</div>
		);
	}
}

class DevtoolsWarning extends Component {
	onClick = () => {
		window.location.reload();
	}

	render() {
		return (
			<button onClick={this.onClick}>Start Benchmark (disables devtools)</button>
		);
	}
}

class App extends Component {
	render({ url }) {
		return (
			<div class="app">
				<header>
					<nav>
						<Link href="/" activeClassName="active">Home</Link>
						<Link href="/reorder" activeClassName="active">Reorder</Link>
						<Link href="/spiral" activeClassName="active">Spiral</Link>
						<Link href="/pythagoras" activeClassName="active">Pythagoras</Link>
						<Link href="/todo" activeClassName="active">ToDo</Link>
						<Link href="/fragments" activeClassName="active">Fragments</Link>
						<Link href="/key_bug" activeClassName="active">Key Bug</Link>
						<Link href="/profiler" activeClassName="active">Profiler</Link>
						<Link href="/context" activeClassName="active">Context</Link>
						<Link href="/devtools" activeClassName="active">Devtools</Link>
						<Link href="/empty-fragment" activeClassName="active">Empty Fragment</Link>
					</nav>
				</header>
				<main>
					<Router url={url}>
						<Home path="/" />
						<Reorder path="/reorder" />
						<div path="/spiral">
							{!isBenchmark
								? <DevtoolsWarning />
								: <Spiral />
							}
						</div>
						<div path="/pythagoras">
							{!isBenchmark
								? <DevtoolsWarning />
								: <Pythagoras />
							}
						</div>
						<Todo path="/todo" />
						<Fragments path="/fragments" />
						<ProfilerDemo path="/profiler" />
						<KeyBug path="/key_bug" />
						<Context path="/context" />
						<DevtoolsDemo path="/devtools" />
						<EmptyFragment path="/empty-fragment" />
					</Router>
				</main>
			</div>
		);
	}
}

function EmptyFragment() {
	return <Fragment />;
}

// document.body.innerHTML = renderToString(<App url={location.href.match(/[#&]ssr/) ? undefined : '/'} />);
// document.body.firstChild.setAttribute('is-ssr', 'true');

installLogger(
	String(localStorage.LOG)==='true' || location.href.match(/logger/),
	String(localStorage.CONSOLE)==='true' || location.href.match(/console/)
);

class X extends Component {
  state = { i: 0 };

  componentDidMount() {
		console.log("Mount X")
    this.id = setInterval(() => {
      this.setState({ i: this.state.i + 1 });
    }, 1000);
  }

  componentWillUnmount() {
		clearTimeout(this.id);
		console.log("Unmount X", this.state.i)
  }

  render() {
    return <div>{this.state.i}</div>;
  }
}
class App2 extends Component {
  state = { i: 0 };
  componentDidMount() {
    setInterval(() => {
      this.setState({ i: this.state.i ^ 1 });
    }, 3000);
  }

  render(props) {
    return (
      <span>
        {this.state.i === 0 && <X />}
        <X />
      </span>
    );
  }
}



const App3 = () => {
  const [id, updateId] = useState(0)
  const vnode = (
    <div>
      <button onClick={() => {
				updateId(id => id + 1)
				console.log("---")
			}}>Increment</button>
      <Main id={id} />
    </div>
	);
	console.log("render", vnode)
	return vnode;
}

const Main = props => {
  return <DataViewer id={props.id} />
}

const DataViewer = props => {
  const data = useData(props.id)
	const t = new Date().getTime()
	if (data === "LOADING") {
		return (
			<div>
			loading({t}): {props.id}
			</div>
		)

	}else {
		return (
			<h1>
          loaded({t}): {props.id}
        </h1>
		)
	}
}

const useData = id => {
  const [data, updateData] = useState('LOADING')
  useEffect(
    () => {
			updateData('LOADING')
      setTimeout(() => {
				console.log("--	")
				updateData('LOADED')
			}, 1000)
    },
    [id]
  )
  return data
}


render(<App3 />, document.body);
