import React from 'react';
import { Button, Segment, Divider } from 'semantic-ui-react';
import calculateCartTotal from '../../utils/calculateCartTotal';


import StripeCheckout from 'react-stripe-checkout';


function CartSummary({ products, handleCheckout, success }) {
  const [cartAmount, setCartAmount] = React.useState(0);
  const [stripeAmout, setStripeAmount] = React.useState(0);
  const [isCartEmpty, setCartEmpty] = React.useState(false);


  React.useEffect(() => {
    const {cartTotal, stripeTotal} = calculateCartTotal(products)
    setCartAmount(cartTotal);
    setStripeAmount(stripeAmout);
    setCartEmpty(products.length === 0);
  }, [products])

  return <>

  <Divider/>
  <Segment clearing size="large">
    <strong> Sub total:</strong> {cartAmount} euro
    <StripeCheckout
    name="demo e-commerce"
    amount={stripeAmout}
    image={products.length > 0 ? products[0].product.mediaUrl: ""}
    currency="EUR"
    shippingAddress={true}
    billingAddress={true}
    zipCode={true}
    token={handleCheckout}
    triggerEvent="onClick"
    stripeKey="pk_test_51H0OB4JMSgFyeUz2KrSgfS6F7McYXTGcf0z3Pq9MZzgyxoBEkWYaDXtCllw3tX3TdnKyhB8ogp2TzBm44R6eYDFW004npDi8YH"
    >
    <Button
      icon="cart"
      color="teal"
      floated="right"
      content="Checkout"
      disabled={isCartEmpty || success}
    />
    </StripeCheckout>
 
  </Segment>
  
  </>
}

export default CartSummary;
