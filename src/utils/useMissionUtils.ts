export function calculateScore(item) {
    return item.checks.reduce((sum, checked) => sum + checked, 0);
  }
  
export function getRowStyle(item) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const itemDate = new Date(item.date);
    itemDate.setHours(0, 0, 0, 0);
  
    return itemDate.getTime() === today.getTime() ? 'bg-primary' : '';
}