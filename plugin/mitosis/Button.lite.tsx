import { useRef, onMount, onUpdate } from '@builder.io/mitosis'

interface ButtonProps {
  label: string
  children: string
  onClick: () => void
  tab: any
  currentTab: string
}

export default function Button(props: ButtonProps) {
  const button = useRef<HTMLButtonElement>()

  onMount(() => {
    button.style.fontWeight = props.currentTab === props.tab ? 'bold' : 'auto'
  })

  onUpdate(() => {
    button.style.fontWeight = props.currentTab === props.tab ? 'bold' : 'inherit'
  }, [props.currentTab])

  return (
    <button
      ref={button}
      type="button"
      aria-label={props.label}
      // handler will not work when passed without function
      onClick={() => props.onClick()}
      style={{
        cursor: 'pointer',
        color: 'black',
        background: 'none',
        border: 'none',
        outline: 'none',
        padding: '0px',
        fontSize: '16px',
        fontFamily: 'inherit',
      }}
    >
      {props.children}
    </button>
  )
}
