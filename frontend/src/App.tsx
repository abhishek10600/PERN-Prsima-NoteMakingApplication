import { Button } from "./components/ui/button";

const App = () => {
  return (
    <div>
      <h1 className="bg-blue-400">Hello World</h1>
      <Button variant={"destructive"} size={"sm"}>
        Click Me
      </Button>
    </div>
  );
};

export default App;
