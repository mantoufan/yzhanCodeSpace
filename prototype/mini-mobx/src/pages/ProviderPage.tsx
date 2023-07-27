import { MobXProviderContext, Provider } from "../which"

export default function ProviderPage() {
  return (
    <div>
      <h3>ProviderPage</h3>
      <Provider foo="bar">
        <MobXProviderContext.Consumer>
          {({ foo }) => foo}
        </MobXProviderContext.Consumer>
      </Provider>
    </div>
  )
}