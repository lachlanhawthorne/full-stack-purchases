import { Text, YStack } from '@my/ui'

export function SubscriptionScreen() {
  return (
    <YStack f={1} jc="center" ai="center" p="$4">
      <Text fontFamily="$body" ta="center" color="white">
        Subscription
      </Text>

      <Text fontFamily="$body" ta="center" color="$gray8Dark">
        RevenueCat
      </Text>

      <Text fontFamily="$body" ta="center" color="$gray8Dark">
        Stripe
      </Text>

      <Text fontFamily="$body" ta="center" color="$gray8Dark">
        Apple Store / Google Play
      </Text>
    </YStack>
  )
}