import FormItem from './formItem'

const TeamForm = () => {
  const form = ['W', 'D', 'L', 'W', 'W']

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {form.map((item, index) => (
        <FormItem key={index} result={item as 'W' | 'L' | 'D'} />
      ))}
    </div>
  )
}

export default TeamForm
