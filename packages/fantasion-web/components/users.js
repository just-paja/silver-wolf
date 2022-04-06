const getFullName = (user) => `${user.firstName} ${user.lastName}`

export const UserName = ({ user, ...props }) =>
  user ? <span {...props}>{getFullName(user)}</span> : null
